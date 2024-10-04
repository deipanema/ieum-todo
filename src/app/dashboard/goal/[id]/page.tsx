type GoalPage = {
  params: { id: string };
};

export default function Goalpage({ params }: GoalPage) {
  const { id } = params;
  return <h1>목표 주소: {id}</h1>;
}
