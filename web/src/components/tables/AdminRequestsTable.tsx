import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import format from "date-fns/format";
import { useMemo } from "react";
import { MakeGenerics, useNavigate, useSearch } from "react-location";
import { Column } from "react-table";
import { useAdminListRequests } from "../../utils/backend-client/admin/admin";
import { Request, RequestStatus } from "../../utils/backend-client/types";
import { durationString } from "../../utils/durationString";
import { usePaginatorApi } from "../../utils/usePaginatorApi";
import { RuleNameCell } from "../AccessRuleNameCell";
import { RequestStatusDisplay } from "../Request";
import { UserAvatarDetails } from "../UserAvatar";
import { RequestsFilterMenu } from "./RequestsFilterMenu";
import { TableRenderer } from "./TableRenderer";

type MyLocationGenerics = MakeGenerics<{
  Search: {
    status?: Lowercase<RequestStatus>;
  };
}>;

export const AdminRequestsTable = () => {
  const search = useSearch<MyLocationGenerics>();
  const navigate = useNavigate<MyLocationGenerics>();

  const { status } = search;

  const paginator = usePaginatorApi<typeof useAdminListRequests>({
    swrHook: useAdminListRequests,
    hookProps: {
      status: status ? (status.toUpperCase() as RequestStatus) : undefined,
    },
  });

  const cols: Column<Request>[] = useMemo(
    () => [
      {
        accessor: "reason",
        Header: "", // blank
        Cell: (props) => (
          <RuleNameCell
            accessRuleId={props.row.original.accessRule.id}
            reason={props.value ?? ""}
          />
        ),
      },
      {
        accessor: "timing",
        Header: "Duration",
        Cell: ({ cell }) => (
          <Flex textStyle="Body/Small">
            {durationString(cell.value.durationSeconds)}
          </Flex>
        ),
      },
      {
        accessor: "requestor",
        Header: "Requested by",
        Cell: ({ cell }) => (
          <Flex textStyle="Body/Small">
            <UserAvatarDetails
              textProps={{
                maxW: "20ch",
                noOfLines: 1,
              }}
              tooltip={true}
              variant="withBorder"
              mr={0}
              size="xs"
              user={cell.value}
            />
          </Flex>
        ),
      },
      {
        accessor: "requestedAt",
        Header: "Date Requested",
        Cell: ({ cell }) => (
          // @NOTE: date resolution is currently not working, we can type these in OpenAPI, but ultimately it will come from BE
          <Flex textStyle="Body/Small">
            {format(new Date(Date.parse(cell.value)), "p dd/M/yy")}
          </Flex>
        ),
      },
      {
        accessor: "status",
        Header: "Status",
        Cell: (props) => {
          return <RequestStatusDisplay request={props.row.original} />;
        },
      },
    ],
    []
  );

  return (
    <>
      <Flex justify="flex-end" my={5}>
        <RequestsFilterMenu
          onChange={(s) =>
            navigate({
              search: (old) => ({
                ...old,
                status: s?.toLowerCase() as Lowercase<RequestStatus>,
              }),
            })
          }
          status={status?.toUpperCase() as RequestStatus}
        />
      </Flex>
      {TableRenderer<Request>({
        columns: cols,
        data: paginator?.data?.requests,
        emptyText: "No requests",
        apiPaginator: paginator,
        linkTo: true,
      })}
    </>
  );
};
