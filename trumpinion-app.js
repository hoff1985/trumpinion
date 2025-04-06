import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://bncpddmukipxxeedgurq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuY3BkZG11a2lweHhlZWRndXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDMwMTQsImV4cCI6MjA1OTUxOTAxNH0.sv4jGnNXUlq1EfbHrI77kVn1CZ3Zuj43H4vuqniY2XA");

export default function TrumpinionApp() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newest, setNewest] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [voted, setVoted] = useState(() => new Set());

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data: newEntries } = await supabase.from("entries").select("*").order("created_at", { ascending: false }).limit(10);
    const { data: topEntries } = await supabase.from("entries").select("*").order("votes", { ascending: false }).limit(10);
    setNewest(newEntries || []);
    setTopRated(topEntries || []);
  };

  const trumpify = (q) => {
    return \`Listen, \${q}? Very interesting, very important. Nobody talks about it like I do. People are saying it's huge, and frankly, I agree. It’s a total winner. Just like me.\`;
  };

  const handleAsk = async () => {
    const newAnswer = trumpify(question);
    const { data, error } = await supabase.from("entries").insert([{ question, answer: newAnswer, votes: 0 }]).select();
    if (data) {
      setAnswer(newAnswer);
      fetchEntries();
      setQuestion("");
    }
  };

  const vote = async (entryId) => {
    if (voted.has(entryId)) return;
    await supabase.rpc("increment_vote", { entry_id: entryId });
    setVoted(new Set(voted).add(entryId));
    fetchEntries();
  };

  const renderList = (list, title) => (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {list.map((entry) => (
        <Card key={entry.id} className="p-2">
          <CardContent>
            <p className="font-semibold">Q: {entry.question}</p>
            <p className="italic">T: {entry.answer}</p>
            <Button onClick={() => vote(entry.id)} disabled={voted.has(entry.id)} className="mt-2">👍 {entry.votes}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <div className="md:col-span-2 space-y-4">
        <Card className="bg-yellow-100 border-2 border-yellow-400 shadow-xl">
          <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4">
            <img src="/trump-caricature.png" alt="Trump Caricature" className="w-48 h-auto rounded-2xl" />
            <div className="flex-1">
              <Textarea placeholder="Ask Trump for his opinion..." value={question} onChange={(e) => setQuestion(e.target.value)} />
              <Button onClick={handleAsk} className="mt-2 w-full">Get Trump's Opinion</Button>
            </div>
          </CardContent>
        </Card>
        {answer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4 bg-orange-50 border-l-4 border-orange-500 shadow-md">
              <CardContent>
                <p className="text-lg font-bold">Trump says:</p>
                <p className="italic">{answer}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      <div className="space-y-6">
        {renderList(newest, "Newest")}
        {renderList(topRated, "Top Rated")}
      </div>
    </div>
  );
}
