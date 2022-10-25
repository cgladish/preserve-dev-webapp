import { ReactElement } from "react";

export default function ConditionalWrapper<TCondition>({
  condition,
  wrapper,
  children,
}: {
  condition: TCondition;
  wrapper: ({
    children,
    condition,
  }: {
    children: ReactElement;
    condition: NonNullable<TCondition>;
  }) => ReactElement;
  children: ReactElement;
}): ReactElement {
  return condition ? wrapper({ children, condition }) : children;
}
