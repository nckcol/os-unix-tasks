module.exports.range = (arg1, arg2 = false, step = 1) => {
  const list = [];

  let from = 0;
  let to = 0;

  if (!arg2) {
    to = arg1;
  } else {
    from = arg1;
    to = arg2;
  }

  for (let i = from; i < to; i += step) {
    list.push(i);
  }

  return list;
};

module.exports.middleware = fun => next => (...props) => {
  if (typeof next === "function") {
    return next(fun(...props));
  }

  return fun(...props);
};
