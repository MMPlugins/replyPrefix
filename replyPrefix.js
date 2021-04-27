module.exports = async function ({ config, commands, knex, formats }) {
  const moment = require("moment");
  const pluginVersion = 1;
  const TABLE_NAME = "replyPrefix";
  const prefixMap = new Map();

  async function populatePrefixMap() {
    const prefixRows = await knex(TABLE_NAME).select().whereNot({
      user_id: "version",
    });

    for (const row of prefixRows) {
      prefixMap.set(row.user_id, row.prefix);
    }
  }

  /**
   * Sets prefix of specified user
   * @param {String} userId
   * @param {String} prefix
   * @returns {Promise<boolean>}
   */
  async function setPrefix(userId, prefix) {
    if (prefix.length > 48) return false;
    try {
      if (prefixMap.has(userId)) {
        await knex(TABLE_NAME)
          .update({
            prefix,
          })
          .where({
            user_id: userId,
          });
      } else {
        await knex(TABLE_NAME).insert({
          user_id: userId,
          prefix,
        });
      }
      prefixMap.set(userId, prefix);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  /**
   * Removes prefix of specified user
   * @param {String} userId
   * @returns {Promise<boolean>}
   */
  async function removePrefix(userId) {
    try {
      await knex(TABLE_NAME)
        .where({
          user_id: userId,
        })
        .delete();
    } catch (e) {
      console.log(e);
      return false;
    }
    prefixMap.delete(userId);

    return true;
  }

  const setPrefixCmd = async function (msg, args) {
    const oldPrefix = prefixMap.has(msg.author.id) ? prefixMap.get(msg.author.id) : "None";
    const success = setPrefix(msg.author.id, args.prefix);

    if (success) {
      msg.channel.createMessage({ content: `Changed your prefix from \`${oldPrefix}\` to \`${args.prefix}\``, messageReferenceID: msg.id });
    } else {
      msg.channel.createMessage(
        { content: "Failed to set prefix, make sure your prefix is below 48 chars and if it is, check the console for errors", messageReferenceID: msg.id },
      );
    }
  };

  const removePrefixCmd = async function (msg) {
    const success = removePrefix(msg.author.id);

    if (success) {
      msg.channel.createMessage({ content: "Removed your prefix", messageReferenceID: msg.id });
    } else {
      msg.channel.createMessage({ content: "Failed to remove your prefix, please check the console for errors", messageReferenceID: msg.id });
    }
  };

  const dmPrefixFormatter = function (threadMessage) {
    const roleName = threadMessage.role_name || config.fallbackRoleName;
    const prefix = prefixMap.has(threadMessage.user_id) ? prefixMap.get(threadMessage.user_id) : "";
    const modInfo = threadMessage.is_anonymous
      ? roleName
      : roleName
      ? `(${roleName}) ${prefix}${threadMessage.user_name}`
      : `${prefix}${threadMessage.user_name}`;

    return modInfo ? `**${modInfo}:** ${threadMessage.body}` : threadMessage.body;
  };

  const threadPrefixFormatter = function (threadMessage) {
    const roleName = threadMessage.role_name || config.fallbackRoleName;
    const prefix = prefixMap.has(threadMessage.user_id) ? prefixMap.get(threadMessage.user_id) : "";
    const modInfo = threadMessage.is_anonymous
      ? roleName
        ? `(Anonymous) (${threadMessage.user_name}) ${roleName}`
        : `(Anonymous) (${threadMessage.user_name})`
      : roleName
      ? `(${roleName}) ${prefix}${threadMessage.user_name}`
      : `${prefix}${threadMessage.user_name}`;

    let result = modInfo ? `**${modInfo}:** ${threadMessage.body}` : threadMessage.body;

    if (config.threadTimestamps) {
      const formattedTimestamp = moment.utc(threadMessage.created_at).format("HH:mm");
      result = `[${formattedTimestamp}] ${result}`;
    }

    result = `\`${threadMessage.message_number}\`  ${result}`;

    return result;
  };

  //#region registering
  // Register all commands and formatters
  commands.addInboxServerCommand("setPrefix", [{ name: "prefix", type: "string", required: true }], setPrefixCmd);

  commands.addInboxServerCommand("removePrefix", [], removePrefixCmd);

  formats.setStaffReplyDMFormatter(dmPrefixFormatter);
  formats.setStaffReplyThreadMessageFormatter(threadPrefixFormatter);
  //#endregion

  //#region migrations
  // If table doesnt exist, create it and insert version
  const runMigrations = async function () {
    console.log("[ReplyPrefix] Running Migrations...");
    let versionInTable = 1;
    if (!(await knex.schema.hasTable(TABLE_NAME))) {
      await knex.schema.createTable(TABLE_NAME, (table) => {
        table.string("user_id", 20);
        table.string("prefix", 48);
        table.primary(["user_id"]);
      });

      await knex(TABLE_NAME).insert({
        user_id: "version",
        prefix: "1",
      });
    } else {
      versionInTable = parseInt(await knex(TABLE_NAME).where("user_id", "version").first().prefix);
    }

    switch (versionInTable) {
      // case 1: Migrations for V2 go here

      // case 2: Migrations for V3 go here

      // case 3: You get it

      default:
        // Always update version as last step
        await knex(TABLE_NAME)
          .update({
            prefix: pluginVersion,
          })
          .where({
            user_id: "version",
          });
        break;
    }
    console.log("[ReplyPrefix] Migrations Finished!");
  };

  await runMigrations();
  await populatePrefixMap();
  console.log(`[ReplyPrefix] Loaded ${prefixMap.size} prefix${prefixMap.size === 1 ? "" : "es"}`);
  //#endregion migrations
};
