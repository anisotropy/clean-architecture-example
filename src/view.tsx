/**
 * 뷰
 * - 프리젠터를 특정 라이브러리(리액트)를 이용해 구현한 함수이다.
 * - 프리젠터에 대한 '험블 함수'이다.
 * - 비순수함수이기 때문에 테스트하기 어렵다.
 * - 엔티티, 유스케이스, 프레젠터에 의존적이다.
 */

/**
 * 유스케이스, 프리젠터에 의존한다.
 */
import {
  recipientUpdatePresenter,
  type RecipientUpdatePresenter,
} from "./presenter";
import type { RecipientUpdateState } from "./useCase";

type FieldProps = RecipientUpdatePresenter["fields"][number] & {
  onChange: (value: string) => void;
};

type ButtonProps = RecipientUpdatePresenter["buttons"][number] & {
  onClick?: () => void;
};

type ModalProps = RecipientUpdatePresenter["modals"][number] & {
  onClose: () => void;
};

const TextField = (props: FieldProps) => (
  <div style={{ display: "flex", gap: 10, padding: 5 }}>
    <label style={{ width: 100 }}>{props.label}</label>
    <div>
      <input
        value={props.value}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.target.value)}
      />
      {props.error ? (
        <div style={{ color: "red", fontSize: "0.6em", marginTop: 3 }}>
          {props.error}
        </div>
      ) : null}
    </div>
  </div>
);

const Field = (props: FieldProps) => {
  if (props.type === "text-field") return <TextField {...props} />;
  return null;
};

const Button = (props: ButtonProps) => (
  <button
    type={props.type ?? "button"}
    disabled={props.disabled}
    onClick={props.onClick}
  >
    {props.label}
  </button>
);

const Modal = (props: ModalProps) =>
  props.open ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          width: 200,
          padding: 10,
          border: "1px solid black",
          backgroundColor: "white",
        }}
      >
        <h4>{props.title}</h4>
        <div>
          <Button label={props.buttonLabel} onClick={props.onClose} />
        </div>
      </div>
    </div>
  ) : null;

export const RecipientUpdateView = (props: {
  state: RecipientUpdateState;
  onChange: (name: keyof RecipientUpdateState["values"], value: string) => void;
  onSubmit: () => void;
  onModalClose: () => void;
}) => {
  const presenter = recipientUpdatePresenter(props.state);
  return (
    <div>
      <h2>{presenter.header.title}</h2>
      <h4>{presenter.header.name}</h4>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          props.onSubmit();
        }}
      >
        {presenter.fields.map((field) => (
          <Field
            key={field.name}
            {...field}
            onChange={(value) => props.onChange(field.name, value)}
          />
        ))}
        <div style={{ display: "flex", gap: 10, padding: 5 }}>
          {presenter.buttons.map((button, index) => (
            <Button key={index} {...button} />
          ))}
        </div>
      </form>
      {presenter.modals.map((modal, index) => (
        <Modal key={index} {...modal} onClose={props.onModalClose} />
      ))}
    </div>
  );
};
