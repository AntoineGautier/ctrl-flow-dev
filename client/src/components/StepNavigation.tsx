import { Link, useLocation } from "react-router-dom";
import "../styles/components/step-navigation.scss";

const steps = [
  { label: "Landing", path: "/" },
  { label: "Details", path: "/details" },
  { label: "Systems", path: "/systems" },
  { label: "Configs", path: "/configs" },
  { label: "Schedules", path: "/schedules" },
  { label: "Results", path: "/results" },
];

function StepNavigation() {
  const location = useLocation();
  const currentIndex = steps.findIndex(
    ({ path }) => location.pathname === path,
  );

  const previous = steps[currentIndex - 1];
  const next = steps[currentIndex + 1];

  return (
    <div className="step-navigation">
      {previous && (
        <div className="prev-container">
          <Link to={previous.path}>
            <i className="icon-left-open" />
            Back
          </Link>
        </div>
      )}

      <div className="step-links">
        {steps
          .filter(({ path }) => path !== "/")
          .map(({ label, path }) => {
            return (
              <Link
                key={label}
                to={path}
                className={location.pathname === path ? "active" : ""}
              >
                <div className="marker"></div>
                {label}
              </Link>
            );
          })}
      </div>

      <div className="next-container">
        {next && (
          <Link role="button" to={next.path}>
            Next Step: {next.label}
            <i className="icon-right-open right" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default StepNavigation;
