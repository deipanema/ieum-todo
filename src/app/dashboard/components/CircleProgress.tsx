export function setProgress(percent: number) {
  const circle = document.querySelector(".progress-ring-circle") as SVGCircleElement | null;
  if (circle) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference.toString();

    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset.toString();
  }
}

export default function CircleProcess() {
  return (
    <div className="absolute left-[40%] top-20 z-10 2xl:left-[50%]">
      <svg width="166" height="166" viewBox="0 0 166 166" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="graph">
          <circle id="Ellipse 215" cx="83" cy="83" r="67" stroke="#000000" strokeWidth="32" />
          <circle className="progress-ring__circle" cx="83" cy="83" r="67" stroke="#F8FAFC" strokeWidth="32" />
        </g>
      </svg>
    </div>
  );
}
