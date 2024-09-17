import styled from "styled-components";

type SpacerProps = {
  horizontal?: boolean;
  size: number;
  style?: any;
};

const Spacer = styled.div<SpacerProps>`
  min-width: ${(props) => props.horizontal && props.size}px;
  min-height: ${(props) => !props.horizontal && props.size}px;
`<any>;

export default Spacer;
