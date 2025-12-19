// function TypingIndicator() {
//   return (
//     <div className="bg-slate-700 max-w-xl p-3 rounded-lg mr-auto flex gap-1">
//       <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
//       <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
//       <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
//     </div>
//   );
// }

// export default TypingIndicator;



function TypingIndicator() {
  return (
    <div className="bg-slate-700 max-w-xl p-3 rounded-lg mr-auto flex items-center gap-2">
      <span className="text-gray-300">Thinking</span>

      <span className="flex gap-1">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
      </span>
    </div>
  );
}

export default TypingIndicator;
