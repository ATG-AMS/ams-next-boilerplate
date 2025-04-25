import Swal, { type SweetAlertOptions } from 'sweetalert2';

// 아이콘 타입에 따른 버튼 색상 매핑
const buttonColors: Record<string, string> = {
  success: '#28a745', // 초록색
  error: '#dc3545', // 빨간색
  warning: '#ffc107', // 주황색
  info: '#17a2b8', // 파란색
  question: '#6c757d', // 회색
};

/**
 * 기본적인 SweetAlert2 옵션
 * @constant {SweetAlertOptions}
 */
export const DEFAULT_TOAST_OPTIONS: SweetAlertOptions = {
  timerProgressBar: true,
  showConfirmButton: true,
  theme: 'auto',
};

/**
 * 기본 다이얼로그.
 * - 간단한 메시지를 알림으로 표시.
 *
 * @param {string} title 다이얼로그 제목.
 * @param {string} text 다이얼로그 본문 텍스트.
 * @param {'success' | 'error' | 'warning' | 'info' | 'question'} icon 아이콘 타입
 */
export function swalDialog(
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info' | 'question'
) {
  Swal.fire({
    ...DEFAULT_TOAST_OPTIONS,
    title,
    icon,
    text,
    confirmButtonColor: buttonColors[icon], // 아이콘에 맞는 버튼 색상 적용
  } as SweetAlertOptions);
}

/**
 * 확인/취소 다이얼로그.
 * - 사용자의 선택을 확인해야 할 때 사용.
 *
 * @param {string} title 다이얼로그 제목.
 * @param {string} text 다이얼로그 본문 텍스트.
 * @param {'success' | 'error' | 'warning' | 'info' | 'question'} icon 아이콘 타입.
 * @param {string} confirmButtonText 확인 버튼 텍스트.
 * @param {string} cancelButtonText 취소 버튼 텍스트.
 * @param {(result: boolean) => void} callback 사용자의 선택 결과(`true`: 확인, `false`: 취소).
 */
export function swalConfirmDialog(
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  confirmButtonText: string,
  cancelButtonText: string,
  callback: (result: boolean) => void
) {
  Swal.fire({
    title,
    icon,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: buttonColors[icon], // 아이콘에 맞는 버튼 색상 적용
  }).then((result) => {
    callback(result.isConfirmed);
  });
}

/**
 * 토스트 메시지.
 * - 화면 우측 하단에 작은 메시지를 띄움.
 *
 * @param {string} title 토스트 제목.
 * @param {string} text 토스트 본문 텍스트.
 * @param {'success' | 'error' | 'warning' | 'info' | 'question'} icon 아이콘 타입.
 * @param {number} [timer=3000] ms(밀리세컨드) 단위의 자동 닫힘 시간(기본값: 3000ms).
 */
export function swalToast(
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  timer: number = 3000
) {
  Swal.fire({
    ...DEFAULT_TOAST_OPTIONS,
    title,
    text,
    icon,
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer,
  });
}

/**
 * 입력 다이얼로그.
 * 사용자 입력을 받을 때 사용.
 *
 * @param {string} title 다이얼로그 제목.
 * @param {'text' | 'email' | 'password' | 'number'} inputType 입력 타입.
 * @param {string} placeholder 입력 필드의 플레이스홀더.
 * @param {string} confirmButtonText 확인 버튼 텍스트.
 * @param {string} cancelButtonText 취소 버튼 텍스트.
 * @param {(inputValue: string | null) => void} callback 사용자가 입력한 값 (취소 시 `null` 반환).
 */
export function swalPrompt(
  title: string,
  inputType: 'text' | 'email' | 'password' | 'number',
  placeholder: string,
  confirmButtonText: string,
  cancelButtonText: string,
  callback: (inputValue: string | null) => void
) {
  Swal.fire({
    title,
    input: inputType,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  }).then((result) => {
    callback(result.value ?? null);
  });
}
