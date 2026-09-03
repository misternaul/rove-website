import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, MessageSquare, PenTool } from "lucide-react";
import CommunityClientUI from "./CommunityClientUI";

export const metadata = { title: "Community | ROVE" };

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
          <Lock className="w-12 h-12 text-[#D4AF37] mb-8" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] mb-6">Restricted Area</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight">The Inner Circle.</h1>
          <p className="text-white/60 font-light max-w-lg mx-auto mb-10 text-lg">
            An exclusive enclave for verified ROVE clientele. Shape our future designs, vote on upcoming drops, and connect with fellow minimalists.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="px-8 py-3 bg-[#141414] border border-white/20 hover:border-[#D4AF37] text-white font-mono text-xs uppercase tracking-widest transition-colors">
              Authenticate
            </Link>
            <Link href="/shop" className="px-8 py-3 bg-[#D4AF37] text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors">
              Acquire Access
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch discussions and polls
  const discussions = await prisma.discussion.findMany({
    include: { author: { select: { name: true } }, comments: true },
    orderBy: { createdAt: 'desc' }
  });

  const activePolls = await prisma.poll.findMany({
    where: { isActive: true },
    include: { 
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  const mappedPolls = activePolls.map(poll => ({
    id: poll.id,
    question: poll.question,
    options: poll.options.map(o => ({
      id: o.id,
      text: o.text,
      votes: o._count.votes
    }))
  }));

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navbar />
      
      <main className="pt-28 md:pt-40 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] mb-4 block flex items-center gap-2">
              <Lock className="w-3 h-3" /> Welcome, Rover
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight">Community Hub.</h1>
          </div>
          <p className="text-sm font-mono text-white/50 max-w-sm md:text-right">
            Your voice dictates the future of ROVE Studio. Participate in active polls or start a discussion.
          </p>
        </div>

        <CommunityClientUI 
          initialDiscussions={discussions} 
          initialPolls={mappedPolls}
          userId={(session.user as any).id} 
        />
      </main>

      <Footer />
    </div>
  );
}
