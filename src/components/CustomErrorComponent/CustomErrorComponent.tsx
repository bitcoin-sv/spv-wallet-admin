import fallingMan from '/falling-man.png';
import { ErrorResponse } from '@bsv/spv-wallet-js-client';

export interface CustomErrorComponentProps {
  error: ErrorResponse | Error;
}

export const CustomErrorComponent = ({ error }: CustomErrorComponentProps) => {
  const isErrorResponse = (error: ErrorResponse | Error): error is ErrorResponse => error?.message === undefined;

  return (
    <div className="flex flex-col w-full h-[80vh] justify-center items-center">
      <img src={fallingMan} alt="error image" />
      <p className="mt-4">Something went wrong</p>
      <p>{isErrorResponse(error) ? JSON.parse(error.content).message : error.message}</p>
      {isErrorResponse(error) && (
        <p>
          {error.response.status} - {error.response.statusText}
        </p>
      )}
    </div>
  );
};
