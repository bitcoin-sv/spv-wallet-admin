import fallingMan from '/falling-man.png';
import { ErrorResponse } from '@bsv/spv-wallet-js-client';

export interface CustomErrorComponentProps {
  error: ErrorResponse;
}

export const CustomErrorComponent = ({ error }: CustomErrorComponentProps) => {
  const parsedError = JSON.parse(error.content);
  const { status, statusText } = error.response;
  return (
    <div className="flex flex-col w-full h-[80vh] justify-center items-center">
      <img src={fallingMan} alt="error image" />
      <p className="mt-4">Something went wrong</p>
      <p>{parsedError.message}</p>
      <p>
        {status} - {statusText}
      </p>
    </div>
  );
};
