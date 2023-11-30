/* eslint-disable no-unused-vars */
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as PropTypes from "prop-types";
import Card from "./Card";

describe("Card Component", () => {
  beforeEach(() => {
    jest.spyOn(PropTypes, "node").mockImplementation((children, cardClass) => {
      return null; 
    });

    jest.spyOn(PropTypes, "string").mockImplementation((children, cardClass) => {
      return null; 
    });
  });

  it("renders without crashing", () => {
    expect(true).toBeDefined();
    render(<Card>Test Content</Card>);
  });

  it("renders children correctly", () => {
    const { getByText } = render(<Card>Test Content</Card>);
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom class correctly", () => {
    const { container } = render(<Card cardClass="custom">Test Content</Card>);
    expect(container.firstChild).toHaveClass("custom");
  });

  it("matches snapshot", () => {
    const { container } = render(<Card>Test Content</Card>);
    expect(container).toMatchSnapshot();
  });
});
