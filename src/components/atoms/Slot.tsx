import * as React from "react";
import { composeRefs } from "@/lib/composeRefs";

/**
 * Slot
 * React의 `children`을 사용하여 컴포넌트를 구성하는 방법입니다.
 */

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    // 렌더링할 newElement는 `Slottable`의 자식으로 전달된 element입니다.
    const newElement = slottable.props.children as React.ReactNode;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // because the new element will be the one rendered, we are only interested
        // newElement가 렌더링될 것이기 때문에, 우리는 오직 newElement가 가진 children에만 초점을 맞춥니다.
        if (React.Children.count(newElement) > 1)
          return React.Children.only(null);
        return React.isValidElement(newElement)
          ? (newElement.props.children as React.ReactNode)
          : null;
      } else {
        return child;
      }
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

Slot.displayName = "Slot";

/**
 * SlotClone
 * `Slot` 컴포넌트의 자식을 렌더링하는 컴포넌트입니다.
 */

interface SlotCloneProps {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<any, SlotCloneProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(slotProps, children.props),
        ref: forwardedRef
          ? composeRefs(forwardedRef, (children as any).ref)
          : (children as any).ref,
      } as React.HTMLAttributes<HTMLElement>);
    }

    return React.Children.count(children) > 1
      ? React.Children.only(null)
      : null;
  },
);

SlotClone.displayName = "SlotClone";

/**
 * Slottable
 * `Slot` 컴포넌트의 자식으로 전달되는 컴포넌트입니다.
 * `Slot` 컴포넌트의 자식으로 전달되는 컴포넌트는 `Slottable` 컴포넌트여야 합니다.
 * `Slottable` 컴포넌트는 `Slot` 컴포넌트의 자식으로 전달된 컴포넌트를 렌더링합니다.
 */

const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

type AnyProps = Record<string, any>;

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && child.type === Slottable;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // 모든 자식 props 은 override 되어야 합니다.
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // 핸들러가 둘 다 존재하는 경우, 합성합니다.
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      }
      // 핸들러가 slot에만 존재하는 경우, slot의 핸들러를 사용합니다.
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    }
    // `style` 인 경우, 합성합니다.
    else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

const Root = Slot;

export {
  Slot,
  Slottable,
  //
  Root,
};
export type { SlotProps };
