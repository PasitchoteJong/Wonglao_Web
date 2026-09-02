import { useState } from "react";
import { Link } from "react-router-dom";

export default function RussianRoulette() {
  const [names, setNames] = useState(["Peng", "Bank", "Beam", "Boom"]);
  const [newName, setNewName] = useState("");
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleAddName = (e) => {
    e.preventDefault();
    if (newName.trim() && !names.includes(newName.trim())) {
      setNames([...names, newName.trim()]);
      setNewName("");
    }
  };

  const removeName = (indexToRemove) => {
    setNames(names.filter((_, index) => index !== indexToRemove));
  };

  const spinRoulette = () => {
    if (names.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    let counter = 0;
    const maxTries = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setWinner(names[randomIndex]);
      counter++;

      if (counter >= maxTries) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-start p-4 pt-10 font-sans pb-12">
      
      <div className="w-full max-w-md mb-6">
        <Link 
          to="/food-splitting" 
          className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 w-fit transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return
        </Link>
      </div>

      <div className="card w-full max-w-md bg-white shadow-sm border border-stone-200 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-1 text-stone-800">Russian Roulette 🎯</h2>
        <p className="text-stone-500 text-sm mb-6">Spin to see who treats the gang today!</p>

        {/* Add name form */}
        <form onSubmit={handleAddName} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add friend's name..." 
            className="input input-bordered w-full bg-[#FAFAFA] border-stone-300 focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] rounded-xl text-stone-700 text-sm" 
          />
          <button type="submit" className="btn bg-stone-800 hover:bg-stone-700 text-white border-none rounded-xl px-4">
            Add
          </button>
        </form>

        {/* Names list */}
        <div className="mb-6">
          <label className="label pb-2">
            <span className="label-text font-medium text-stone-700">Participants ({names.length})</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {names.map((name, index) => (
              <div key={index} className="badge badge-lg bg-[#F4F5EB] border-[#939C76] text-stone-700 gap-2 py-3 px-3 rounded-xl">
                {name}
                <button onClick={() => removeName(index)} className="text-stone-400 hover:text-stone-700 font-bold">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Winner Display Box */}
        <div className="bg-[#FAFAFA] border border-stone-200 rounded-2xl p-6 text-center mb-6 min-h-30 flex flex-col items-center justify-center">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">The Lucky One</p>
          <h3 className={`text-3xl font-extrabold ${isSpinning ? 'text-[#D97757] animate-pulse' : winner ? 'text-stone-800' : 'text-stone-300'}`}>
            {winner || "Ready?"}
          </h3>
          {winner && !isSpinning && (
            <p className="text-xs text-[#D97757] mt-2 font-medium">🎉 Congratulations, you are treating!</p>
          )}
        </div>

        {/* Spin Button */}
        <button 
          onClick={spinRoulette}
          disabled={names.length === 0 || isSpinning}
          className={`btn w-full text-lg border-none text-white rounded-xl shadow-md ${names.length > 0 && !isSpinning ? 'bg-[#D97757] hover:bg-[#C26344]' : 'bg-stone-300'}`}
        >
          {isSpinning ? "Spinning..." : "SPIN THE ROULETTE 🎲"}
        </button>

      </div>
    </div>
  );
}