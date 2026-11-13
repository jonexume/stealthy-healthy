/**
 * Component render tests — verify key UI properties without full Next.js router.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import Alert from "@/app/components/ui/Alert";
import Card from "@/app/components/ui/Card";
import ProgressBar from "@/app/components/ui/ProgressBar";
import Spinner from "@/app/components/ui/Spinner";
import EmptyState from "@/app/components/ui/EmptyState";
import SampleContentBanner from "@/app/components/ui/SampleContentBanner";
import Toggle from "@/app/components/ui/Toggle";

// ─── Button ──────────────────────────────────────────────────────────────────

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading spinner when isLoading", () => {
    render(<Button isLoading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // Spinner is rendered (aria-hidden, so check DOM presence)
    expect(btn.querySelector(".animate-spin")).toBeTruthy();
  });

  it("fires onClick", () => {
    const fn = jest.fn();
    render(<Button onClick={fn}>Go</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", () => {
    const fn = jest.fn();
    render(<Button disabled onClick={fn}>Go</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(fn).not.toHaveBeenCalled();
  });
});

// ─── Badge ────────────────────────────────────────────────────────────────────

describe("Badge", () => {
  it("renders its text content", () => {
    render(<Badge variant="teal">Reviewed</Badge>);
    expect(screen.getByText("Reviewed")).toBeInTheDocument();
  });

  it("applies correct variant class", () => {
    const { container } = render(<Badge variant="red">Fever</Badge>);
    expect(container.firstChild).toHaveClass("bg-red-100");
  });
});

// ─── Alert ───────────────────────────────────────────────────────────────────

describe("Alert", () => {
  it("renders children", () => {
    render(<Alert variant="info">Something happened</Alert>);
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Alert variant="warning" title="Heads up">Pay attention</Alert>);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("has role=alert for accessibility", () => {
    render(<Alert variant="error">Error!</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("emergency variant gets correct bg class", () => {
    const { container } = render(<Alert variant="emergency">Emergency</Alert>);
    expect(container.firstChild).toHaveClass("bg-red-100");
  });
});

// ─── Card ─────────────────────────────────────────────────────────────────────

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("has bg-white class by default", () => {
    const { container } = render(<Card>hello</Card>);
    expect(container.firstChild).toHaveClass("bg-white");
  });
});

// ─── ProgressBar ──────────────────────────────────────────────────────────────

describe("ProgressBar", () => {
  it("renders with correct aria attributes", () => {
    render(<ProgressBar value={60} label="Upload" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "60");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps value above 100 to 100", () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps value below 0 to 0", () => {
    render(<ProgressBar value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});

// ─── Spinner ──────────────────────────────────────────────────────────────────

describe("Spinner", () => {
  it("renders with role=status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders custom label text", () => {
    render(<Spinner label="Saving…" />);
    expect(screen.getByText("Saving…")).toBeInTheDocument();
  });
});

// ─── EmptyState ───────────────────────────────────────────────────────────────

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="Empty" description="Try something else" />);
    expect(screen.getByText("Try something else")).toBeInTheDocument();
  });

  it("renders action button and fires callback", () => {
    const fn = jest.fn();
    render(<EmptyState title="Empty" action={{ label: "Retry", onClick: fn }} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ─── SampleContentBanner ─────────────────────────────────────────────────────

describe("SampleContentBanner", () => {
  it("displays SAMPLE CONTENT text for content type", () => {
    render(<SampleContentBanner type="content" />);
    expect(screen.getByText(/SAMPLE CONTENT/i)).toBeInTheDocument();
  });

  it("displays FICTIONAL LISTING text for listing type", () => {
    render(<SampleContentBanner type="listing" />);
    expect(screen.getByText(/FICTIONAL LISTING/i)).toBeInTheDocument();
  });

  it("displays PROTOTYPE text for prototype type", () => {
    render(<SampleContentBanner type="prototype" />);
    expect(screen.getByText(/PROTOTYPE/i)).toBeInTheDocument();
  });

  it("has role=note", () => {
    render(<SampleContentBanner />);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});

// ─── Toggle ───────────────────────────────────────────────────────────────────

describe("Toggle", () => {
  it("renders label", () => {
    render(<Toggle id="t1" label="Analytics" checked={false} onChange={() => {}} />);
    expect(screen.getByLabelText("Analytics")).toBeInTheDocument();
  });

  it("reflects checked state via aria-checked", () => {
    render(<Toggle id="t2" label="Crash reports" checked={true} onChange={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange when clicked", () => {
    const fn = jest.fn();
    render(<Toggle id="t3" label="Location" checked={false} onChange={fn} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(fn).toHaveBeenCalledWith(true);
  });

  it("does not call onChange when disabled", () => {
    const fn = jest.fn();
    render(<Toggle id="t4" label="Disabled toggle" checked={false} onChange={fn} disabled />);
    fireEvent.click(screen.getByRole("switch"));
    expect(fn).not.toHaveBeenCalled();
  });
});
