interface IHeading {
  title: string;
}

export const Heading = ({ title }: IHeading) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-chirp-bold text-white tracking-tight text-center">{title}</h1>
      <div className="mt-3 h-px w-full bg-zinc-800" />
    </div>
  );
};
