import fallingMan from '/falling-man.png';
import { ErrorResponse } from '@bsv/spv-wallet-js-client';

export interface CustomErrorComponentProps {
  error: ErrorResponse | Error;
}

interface ApiErrorInfo {
  status: number;
  statusText: string;
  message: string;
}

const extractApiError = (error: ErrorResponse | Error): ApiErrorInfo | null => {
  if (error instanceof ErrorResponse) {
    let errorMessage = '';
    try {
      errorMessage = JSON.parse(error.content).message;
    } catch (error) {
      console.log('Got unexpected error when parsing the content of the error response', error);
    }

    return {
      status: error.response.status,
      statusText: error.response.statusText,
      message: errorMessage,
    };
  }
  return null;
};

const ApiError = ({ apiError }: { apiError: ApiErrorInfo }) => (
  <>
    <p className={'first-letter:capitalize'}> {apiError.message}</p>
    <p>
      {apiError.status} - {apiError.statusText}
    </p>
  </>
);

const ErrorMessage = ({ error }: { error: Error }) => <p>{error.message}</p>;

export const CustomErrorComponent = ({ error }: CustomErrorComponentProps) => {
  const apiError = extractApiError(error);

  return (
    <div className="flex flex-col w-full h-[80vh] justify-center items-center">
      <img src={fallingMan} alt="error image" />
      <p className="mt-4">Something went wrong</p>
      {apiError ? <ApiError apiError={apiError} /> : <ErrorMessage error={error} />}
    </div>
  );
};
