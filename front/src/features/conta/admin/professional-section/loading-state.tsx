interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Aguarde um momento",
}: LoadingStateProps) {
  return (
    <div className="text-center">
      <div className="border-principal-500 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-transparent" />
      <p className="text-principal-600 mt-2 text-sm">{message}</p>
    </div>
  );
}
