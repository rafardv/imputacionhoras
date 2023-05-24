// EJEMPLO DE API CALL (la de login):
export const accessBilldinCall = async ({ username, password }) => {
  const loginUrl = `${baseUrl}users/login`;

  const body = {
    username: username,
    password: password,
  };

  return fetch(loginUrl, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { error: error };
    })
    .then((response) => {
      return response;
    });
};

export const getProjectsCall = async ({ jwtToken }) => {
  const projectsUrl = `${baseUrl}projects/userProjectsAndWorkspaceProjects`;

  return fetch(projectsUrl, {
    headers: {
      ...headers,
      Authorization: jwtToken,
    },
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => {
      return { error: error };
    })
    .then((response) => {
      return response;
    });
};

export const getProjectCall = async ({ projectPK, workspacePK, jwtToken }) => {
  const projectUrl = `${baseUrl}projects?projectId=${projectPK}&workspacePK=${workspacePK}`;

  return fetch(projectUrl, {
    headers: {
      ...headers,
      Authorization: jwtToken,
    },
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => {
      return { error: error };
    })
    .then((response) => {
      return response;
    });
};

export const updateProjectByPropertyCall = async ({
  PK,
  workspacePK,
  jwtToken,
}) => {
  const updateProjectUrl = `${baseUrl}projects/updateByProperty`;

  const body = { PK, workspacePK, propertyToUpdate: { name, value } };

  return fetch(updateProjectUrl, {
    headers: {
      ...headers,
      Authorization: jwtToken,
    },
    method: "PATCH",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { error: error };
    })
    .then((response) => {
      return response;
    });
};

export const getUserByPK = async ({ userPK, jwtToken }) => {
  const userUrl = `${baseUrl}users/by-pk?userPK=${userPK}`;

  return fetch(userUrl, {
    headers: {
      ...headers,
      Authorization: jwtToken,
    },
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => {
      return { error: error };
    })
    .then((response) => {
      return response;
    });
};

export const baseUrl = "https://apidev.app.billdin.com/";

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json",
};
