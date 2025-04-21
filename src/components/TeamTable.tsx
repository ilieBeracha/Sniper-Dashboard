"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import AvatarText from "../components/ui/badge/Badge";
import Checkbox from "./Checkbox";
import { BiTrash, BiChevronRight } from "react-icons/bi";

interface TableRowData {
  id: string;
  user: {
    initials: string;
    name: string;
    email: string;
  };
  avatarColor: "brand" | "blue" | "green" | "red" | "yellow" | "gray";
  product: {
    name: string;
    price: string;
    purchaseDate: string;
  };
  status: {
    type: "Complete" | "Warning" | "Cancel" | "Pending";
  };
  actions: {
    delete: boolean;
  };
}

const tableRowData: TableRowData[] = [
  {
    id: "DE124321",
    user: {
      initials: "AB",
      name: "John Doe",
      email: "johndoe@gmail.com",
    },
    avatarColor: "brand",
    product: {
      name: "Software License",
      price: "$18,50.34",
      purchaseDate: "2024-06-15",
    },
    status: {
      type: "Complete",
    },
    actions: {
      delete: true,
    },
  },
  {
    id: "DE124322",
    user: {
      initials: "CD",
      name: "Jane Smith",
      email: "janesmith@gmail.com",
    },
    avatarColor: "brand",
    product: {
      name: "Cloud Hosting",
      price: "$12,99.00",
      purchaseDate: "2024-06-18",
    },
    status: {
      type: "Pending",
    },
    actions: {
      delete: true,
    },
  },
  {
    id: "DE124323",
    user: {
      initials: "EF",
      name: "Michael Brown",
      email: "michaelbrown@gmail.com",
    },
    avatarColor: "brand",
    product: {
      name: "Web Domain",
      price: "$9,50.00",
      purchaseDate: "2024-06-20",
    },
    status: {
      type: "Cancel",
    },
    actions: {
      delete: true,
    },
  },
  {
    id: "DE124324",
    user: {
      initials: "GH",
      name: "Alice Johnson",
      email: "alicejohnson@gmail.com",
    },
    avatarColor: "brand",
    product: {
      name: "SSL Certificate",
      price: "$2,30.45",
      purchaseDate: "2024-06-25",
    },
    status: {
      type: "Pending",
    },
    actions: {
      delete: true,
    },
  },
  {
    id: "DE124325",
    user: {
      initials: "IJ",
      name: "Robert Lee",
      email: "robertlee@gmail.com",
    },
    avatarColor: "brand",
    product: {
      name: "Premium Support",
      price: "$15,20.00",
      purchaseDate: "2024-06-30",
    },
    status: {
      type: "Complete",
    },
    actions: {
      delete: true,
    },
  },
];

export default function TeamTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(tableRowData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="overflow-hidden rounded-md border border-[#161616] bg-[#161616 shadow-sm">
      <div className="flex flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between border-b border-[#161616"></div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="">
            <TableRow className="border-y-2 border-[#161616]">
              <TableCell className="px-6 py-8 font-medium text-gray-400 text-xs uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                  <span>Deal ID</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
                Customer
              </TableCell>
              <TableCell className="px-6 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
                Product/Service
              </TableCell>
              <TableCell className="px-6 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
                Deal Value
              </TableCell>
              <TableCell className="px-6 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
                Close Date
              </TableCell>
              <TableCell className="px-6 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell className="px-6 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRowData.map((row: TableRowData, index) => (
              <TableRow
                key={row.id}
                className={`hover:bg-gray-900 transition-colors ${
                  selectedRows.includes(row.id) ? "border-[#161616]" : ""
                } ${
                  index === tableRowData.length - 1
                    ? ""
                    : "border-b border-gray-100"
                }`}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                    <span className="font-medium text-gray-400 text-sm">
                      {row.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-400 flex items-center justify-center text-gray-400 font-medium">
                      {row.user.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-400 text-sm">
                        {row.user.name}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {row.user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-gray-400 text-sm font-medium">
                    {row.product.name}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-gray-400 text-sm font-semibold">
                    {row.product.price}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-gray-400 text-sm">
                    {row.product.purchaseDate}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <AvatarText
                    variant="light"
                    color={
                      row.status.type === "Complete"
                        ? "success"
                        : row.status.type === "Pending"
                        ? "warning"
                        : "error"
                    }
                    size="sm"
                  >
                    {row.status.type}
                  </AvatarText>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {row.actions.delete && (
                    <button className="p-2 rounded-full transition-colors">
                      <BiTrash className="text-gray-400 size-5 hover:text-red-500" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-400 ">
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-gray-400 shadow-sm transition-colors">
            See all
            <BiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
