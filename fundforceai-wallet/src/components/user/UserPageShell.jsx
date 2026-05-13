export default function UserPageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[12%] top-[-18rem] h-[40rem] w-[40rem] rounded-full bg-[#161c2d]/70 blur-[120px]" />
        <div className="absolute right-[-12rem] top-[5rem] h-[35rem] w-[35rem] rounded-full bg-[#fe8200]/12 blur-[130px]" />
        <div className="absolute bottom-[-16rem] left-[28%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/5 blur-[110px]" />
      </div>

      {children}
    </div>
  );
}