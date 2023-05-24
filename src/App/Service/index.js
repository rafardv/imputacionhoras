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

export const getProjectsCall = async () => {
  const projectsUrl = `${baseUrl}projects/userProjectsAndWorkspaceProjects`;

  return fetch(projectsUrl, {
    headers: headers,
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

export const getProjectCall = async ({ projectPK, workspacePK }) => {
  const projectUrl = `${baseUrl}projects?projectId=${projectPK}&workspacePK=${workspacePK}`;

  const body = {
    projectPK: projectPK,
    workspacePK: workspacePK,
  };

  return fetch(projectUrl, {
    headers: headers,
    method: "GET",
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

export const updateProjectByPropertyCall = async ({ PK, workspacePK }) => {
  const updateProjectUrl = `${baseUrl}projects/updateByProperty`;

  const body = { PK, workspacePK, propertyToUpdate: { name, value } };

  return fetch(updateProjectUrl, {
    headers: headers,
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

  const body = {
    userPK: userPK,
    jwtToken: jwtToken,
  };

  return fetch(userUrl, {
    headers: { ...headers, Authorization: jwtToken },
    method: "GET",
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

export const baseUrl = "https://apidev.app.billdin.com/";

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json",
};
