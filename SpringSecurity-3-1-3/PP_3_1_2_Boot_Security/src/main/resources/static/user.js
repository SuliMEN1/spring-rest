$(async function () {
    await getUserTable();
})

const userService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getUser: async () => await fetch('api/user')
}

async function getUserTable() {
    let table = $('#mainUser tbody');
    table.empty();

    await userService.getUser()
        .then(res => res.json())
        .then(user => {
            let tableMainUser = `$(
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td id="setRole">

                </td>
            </tr>
            )`;
            table.append(tableMainUser);

            let setRole = $('#setRole');
            user.roles.forEach(role => {
                let roleList = `${role.name} `;
                setRole.append(roleList)
            })
            let userMenu = $('#userMenu');
            let userName = `${user.email}`;
            userMenu.append(userName);

            let roleMenu = $('#roleMenu');
            user.roles.forEach(role => {
                let roleName = `${role.name} `;
                roleMenu.append(roleName)});

        })
}

