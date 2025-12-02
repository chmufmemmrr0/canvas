import Card from "../components/Card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16 w-screen">
      <h1 className="headerGradient">Canvas Games</h1>
      <div className="flex flex-row items-center justify-center gap-16 *:gap-16 *:flex *:flex-col">
        <div>
          <Card image="img" title="Snake" description="desc" path="/Snake"/>
          <Card image="img" title="Tic-Tac-Toe" description="desc" path="/TicTacToe"/>
          <Card image="img" title="title" description="desc" path="/Snake"/>
        </div>
        <div>
          <Card image="img" title="title" description="desc" path="/Snake"/>
          <Card image="img" title="title" description="desc" path="/Snake"/>
          <Card image="img" title="title" description="desc" path="/Snake"/>
        </div>
        <div>
          <Card image="img" title="title" description="desc" path="/Snake"/>
          <Card image="img" title="title" description="desc" path="/Snake"/>
          <Card image="img" title="title" description="desc" path="/Snake"/>
        </div>
      </div>
    </div>
  );
}