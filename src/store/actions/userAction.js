const setUser = (user) => {
  return {
    type: 'SET_USER',
    data: user
  }
}

export {
  setUser
}