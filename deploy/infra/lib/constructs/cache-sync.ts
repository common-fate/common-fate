import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import { AccessHandler } from "./access-handler";
import { grantInvokeCommunityProviders } from "../helpers/permissions";

interface Props {
  dynamoTable: Table;
  accessHandler: AccessHandler;
}

export class CacheSync extends Construct {
  private _lambda: lambda.Function;
  private eventRule: events.Rule;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    const code = lambda.Code.fromAsset(
      path.join(__dirname, "..", "..", "..", "..", "bin", "cache-sync.zip")
    );

    this._lambda = new lambda.Function(this, "HandlerFunction", {
      code,
      timeout: Duration.seconds(60),
      environment: {
        COMMONFATE_ACCESS_HANDLER_URL: props.accessHandler.getApiUrl(),
        COMMONFATE_TABLE_NAME: props.dynamoTable.tableName,
      },
      runtime: lambda.Runtime.GO_1_X,
      handler: "cache-sync",
    });

    props.dynamoTable.grantReadWriteData(this._lambda);

    //add event bridge trigger to lambda
    this.eventRule = new events.Rule(this, "EventBridgeCronRule", {
      schedule: events.Schedule.cron({ minute: "0/5" }),
    });

    // add the Lambda function as a target for the Event Rule
    this.eventRule.addTarget(new targets.LambdaFunction(this._lambda));

    // allow the Event Rule to invoke the Lambda function
    targets.addLambdaPermission(this.eventRule, this._lambda);

    // allows to invoke the function from any account if they have the correct tag
    grantInvokeCommunityProviders(this._lambda);
  }
  getLogGroupName(): string {
    return this._lambda.logGroup.logGroupName;
  }
  getFunctionName(): string {
    return this._lambda.functionName;
  }
}
