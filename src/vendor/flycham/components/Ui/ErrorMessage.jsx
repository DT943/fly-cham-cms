import { Info } from '@phosphor-icons/react';

const ErrorMessage = ({ error }) => (
    typeof error === 'string' && error.trim() !== '' ? (
        <div className="mt-1 flex items-center justify-start gap-2">
            <Info size={16} className="text-alert" />
            <p className="text-xs text-alert">{error }</p>
        </div>
    ) : null
);

export default ErrorMessage;
