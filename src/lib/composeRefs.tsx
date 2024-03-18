import * as React from 'react';
/**
 * 여러 개의 React ref를 하나의 ref로 조합하는 유틸리티입니다.
 * React의 ref는 일반적으로 컴포넌트의 DOM 요소나 클래스 컴포넌트 인스턴스에 직접적인 접근을 할 수 있도록 해줍니다.
 * 경우에 따라 여러 개의 ref를 같은 요소에 적용하고 싶을 때가 있는데, 이러한 상황에 이 유틸리티를 사용할 수 있습니다.
 */

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * 주어진 ref에 주어진 값을 설정합니다.
 * 이 유틸리티는 콜백 ref와 RefObject를 모두 처리합니다.
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * 여러 ref를 하나로 조합하는 유틸리티입니다.
 * 콜백 ref와 RefObject를 모두 받아들입니다.
 */
function composeRefs<T>(...refs: Array<PossibleRef<T>>) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

/**
 * 여러 ref를 조합하는 사용자 정의 훅입니다.
 * 콜백 ref와 RefObject를 모두 받아들입니다.
 */
function useComposedRefs<T>(...refs: Array<PossibleRef<T>>) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
