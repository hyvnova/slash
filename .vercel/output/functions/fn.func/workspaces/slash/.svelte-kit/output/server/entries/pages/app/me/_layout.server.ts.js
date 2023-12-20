const load = async ({ parent }) => {
  let data = await parent();
  return data;
};
export {
  load
};
