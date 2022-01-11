/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */

/**
 * Doc for the file:
 * This destination in general uses upsert API exposed by Pardot for creation/updation of a prospect
 *
 * externalId should be sent inside context object
 * Example:
 * {
 *    ...,
 *    context: {
 *      externalId: {
 *        type: 'pardotId' || 'crmfid',
 *        id: number || string (whatever pardot/salesforce provides as pardot id or crm fid)
 *      },
 *      ...
 *    }
 *    ...
 * }
 *
 * If externalId sent as a valid object including type & id in it, we would update the prospect
 * If externalId is not sent or not a valid object, we would by default create the prospect
 *
 * Cases:
 * case-1 -> externalId = { type: 'randpmType', id: 1239835 } - created(use upsert API) using email in payload
 * case-2 -> externalId = { type: 'pardotId', id: 1239835 } - update(use upsert API) using pardot id provided here
 * case-3 -> externalId = { type: 'crmfid', id: 'xyze' } - try to update(use upsert API) using crmfid
 * case-4 -> externalId = { type: 'pardotId' } - created(use upsert API) using email in payload
 * case-5 -> externalId = { id: 1234434 } - created(use upsert API) using email in payload
 * case-6 -> externalId = { } - created(use upsert API) using email in payload
 * case-7 -> externalId not sent in payload - created(use upsert API) using email in payload
 *
 */

const get = require("get-value");
const { identifyConfig } = require("./config");
const logger = require("../../../logger");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  CustomError,
  removeUndefinedValues,
  getAccessToken,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");

const { CONFIG_CATEGORIES } = require("./config");

const buildResponse = (payload, url, destination, token) => {
  const responseBody = removeUndefinedValues(payload);
  const response = defaultRequestConfig();
  response.endpoint = url;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Bearer ${token}`,
    "Pardot-Business-Unit-Id": destination.Config.businessUnitId
  };
  response.body.FORM = responseBody;
  return response;
};

const isExtIdNotProperlyDefined = externalId => {
  return !externalId || (externalId && (!externalId.type || !externalId.id));
};

/**
 * This method provides the url that would be used to send the event to Pardot
 *
 * @typedef {Object} urlParams
 * @property {{ type: string, id: string }} externalId
 * @property {Object} category
 * @property {string} email - email sent in the payload
 * @returns {properUrl} - The complete url used for sending event to Pardot
 */
const getUrl = urlParams => {
  const { externalId, category, email } = urlParams;
  let properUrl = `${category.endPointUpsert}/email/${email}`;
  if (isExtIdNotProperlyDefined(externalId)) {
    logger.debug(`PARDOT: externalId doesn't exist/invalid datastructure`);
    return properUrl;
  }
  // when there is a proper externalId object defined
  switch (externalId.type.toLowerCase()) {
    case "pardotid":
      properUrl = `${category.endPointUpsert}/id/${externalId.id}`;
      break;
    case "crmfid":
      properUrl = `${category.endPointUpsert}/fid/${externalId.id}`;
      break;
    default:
      logger.debug(
        `PARDOT: externalId type is different from the ones supported`
      );
      break;
  }
  return properUrl;
};

const processIdentify = ({ message, metadata }, destination, category) => {
  const { campaignId } = destination.Config;
  const accessToken = getAccessToken(metadata);

  const extId = get(message, "context.externalId");
  const email = getFieldValueFromMessage(message, "email");

  const traits = getFieldValueFromMessage(message, "traits");
  const prospectObject = constructPayload(traits, identifyConfig);

  const url = getUrl({
    externalId: extId,
    category,
    email
  });

  if (!prospectObject.campaign_id) {
    prospectObject.campaign_id = campaignId;
  }

  return buildResponse(prospectObject, url, destination, accessToken);
};

const processEvent = (metadata, message, destination) => {
  let response;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!destination.Config.campaignId) {
    throw new CustomError("Campaign Id is mandatory", 400);
  }

  if (!destination.Config.businessUnitId) {
    throw new CustomError("Business Unit Id is mandatory", 400);
  }

  if (message.type === "identify") {
    const category = CONFIG_CATEGORIES.IDENTIFY;

    response = processIdentify({ message, metadata }, destination, category);
  } else {
    throw new CustomError(`${message.type} is not supported in Pardot`, 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.metadata, event.message, event.destination);
};

const processRouterDest = async events => {
  if (!Array.isArray(events) || events.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const responseList = Promise.all(
    events.map(event => {
      try {
        return getSuccessRespEvents(
          process(event),
          [event.metadata],
          event.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [event.metadata],
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return responseList;
};

exports.processRouterDest = processRouterDest;
