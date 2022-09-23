const SendMessage = async (
  ctx: any,
  id: bigint,
  url: string,
  title: string,
  description: string
) => {
  let str = title + "\n" + `<a  href = '${description}'> Link </a>`;
  ctx.telegram.sendPhoto(id, url, {
    caption: str,
    parse_mode: "HTML",
  });
};

export { SendMessage };
