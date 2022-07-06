import { ReactFC } from "../types";

export const Table: ReactFC = ({ children, className = "", ...props }) => (
    <div className={`Table${className}`} {...props}>
        {children}
    </div >
)

export const TableRow: ReactFC = ({ children, className = "", ...props }) => <div className={`Table-Row ${className}`} {...props}>{children}</div>
export const TableBody: ReactFC = ({ children, className = "", ...props }) => <div className={`Table-Body ${className}`} {...props}>{children}</div>
export const TableHeader: ReactFC = ({ children, className = "", ...props }) => <div className={`Table-Header ${className}`} {...props}>{children}</div>
export const TableFooter: ReactFC = ({ children, className = "", ...props }) => <div className={`Table-Footer ${className}`} {...props}>{children}</div>
export const TableCell: ReactFC = ({ children, className = "", ...props }) => <div className={`Table-Cell ${className}`} {...props}>{children}</div>