export const ErrorMessage = ({ error }: { error: unknown }) => {
  const message = typeof error === "string" ? error : "";

  return message ? (
    <p className="text-red-500 mt-2 mb-5 text-small">{message}</p>
  ) : null;
};
