const SendMessage = async (
  ctx: any,
  id: bigint,
  url: string,
  title: string,
  description: string,
  titleStr: string
) => {
  let str =
    "<b>" +
    title +
    "</b>" +
    "<i>" +
    titleStr +
    "</i>" +
    "\n" +
    `<a  href = '${description}'>Read more...</a>`;
  await ctx.telegram.sendPhoto(id, url, {
    caption: str,
    parse_mode: "HTML",
  });
};

export { SendMessage };
