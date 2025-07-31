/**
 * 엔티티
 * - 규칙을 자동화하는 시스템이 없더라도 그대로 존재하는 핵심 업무 규칙이다.
 * - 어떤 것에도 의존하지 않는 가장 하위 계층이다.
 * - 순수함수로 구성되어 있어서 테스트하기 쉽다.
 * - 특정 프레임워크나 라이브러리에 의존하진 않는다.
 */

export type RecipientEntity = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  accountNumber: string;
};

/**
 * 수취인의 이름을 만들어낸댜.
 */
const deriveName = (
  recipient: Pick<RecipientEntity, "firstName" | "middleName" | "lastName">
) =>
  [recipient.firstName, recipient.middleName, recipient.lastName]
    .filter(Boolean)
    .join(" ");

export const recipientEntity = {
  deriveName,
};
