import { Component } from "react";

export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="route-load-error" role="alert">
        <strong>This section did not load.</strong>
        <span>The rest of the dashboard is still available.</span>
        <button type="button" onClick={() => window.location.reload()}>
          Reload this page
        </button>
      </div>
    );
  }
}
