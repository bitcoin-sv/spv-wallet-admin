import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';
import { toast } from 'sonner';
import { CopyIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';


export function Shortener({ title, value, link }: {
  title: string,
  value: string,
  link?: { to: string, key: string }
}) {
  return <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="align-middle inline-flex items-center gap-2 cursor-default">
        <CopyIcon
          size={12}
          onClick={() => onClickCopy(title, value)}
          className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
        />

        {link ? (
          <Link
            className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[100px] block hover:underline"
            to={link.to}
            search={{ [link.key]: value }}
          >
            {value}
          </Link>
        ) : (
          <span className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[100px] block">
            {value}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{value}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>;
}

const onClickCopy = async (title: string, text: string) => {
  await navigator.clipboard.writeText(text);
  toast.success(`${title} Copied to clipboard`);
};
