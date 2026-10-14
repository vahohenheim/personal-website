import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PostDecisionTableComponentProps = { columns: string[]; rows: string[][] };

/** A table of decisions. It scrolls on its own on phones; the page never does. */
const PostDecisionTableComponent = ({ columns, rows }: PostDecisionTableComponentProps) => {
  return (
    <div className="my-2 min-w-0 overflow-hidden rounded border border-line">
      <Table className="min-w-[640px] text-[14px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column} scope="col">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.join("|")} className="hover:bg-transparent">
              {row.map((cell, index) => (
                <TableCell
                  key={columns[index] ?? index}
                  className={index === 0 ? "font-medium text-text" : "text-text2"}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostDecisionTableComponent;
