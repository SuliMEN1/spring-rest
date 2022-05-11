$(async function () {
    await getUserTable();
     addNewUser();
     getDefaultModal()
})

const userService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getUser: async () => await fetch('api/admin'),
    findOneUser: async (id) => await fetch(`api/admin/${id}`),
    findUserAuntificated: async () => await fetch('api/admin/user'),
    addNewUser: async (user) => await fetch('api/admin', {method: 'POST', headers: userService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/admin/${id}`, {method: 'DELETE', headers: userService.head}),
    updateUser: async (user, id) => await fetch(`api/admin/${id}`, {method: 'PUT', headers: userService.head, body: JSON.stringify(user)}),
}

async function getUserTable() {
    let table = $('#mainUser tbody');
    table.empty();

    await userService.getUser()
        .then(res => res.json())
        .then(users => {
                users.forEach(user => {
                    let tableMainUser = `$(
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td >${user.email}</td>
                <td name="roleName">
                </td>
                <td>
                     <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                            data-toggle="modal" data-target="#modal">Изменить</button>
                </td>
                <td>
                     <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                             data-toggle="modal" data-target="#modal">Удалить</button>
                </td>
            </tr>
            )`;
                    table.append(tableMainUser);
                    let setRole = document.getElementsByName('roleName');
                    let roleAdd = Array.from(setRole).pop();
                    user.roles.forEach(role => {
                        let roleName = role.name + " ";
                        roleAdd.append(roleName)
                    })
                })
        })
    let userAuntificated = await userService.findUserAuntificated();
    let user = userAuntificated.json();
    user.then(userAut => {
        let userMenu = $("#userMenu");
        userMenu.empty();
        let userName = userAut.email;
        userMenu.append(userName);

        let roleMenu = $('#roleMenu');
        roleMenu.empty();
        userAut.roles.forEach(role => {
            let roleName = role.name + ' ';
            roleMenu.append(roleName);
        })
    })
    $("#mainUser").find('button').on('click', (event) => {
        let defaultModal = $('#modal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getDefaultModal() {
    $('#modal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let findUser = await userService.findOneUser(id);
    let user = findUser.json();

    modal.find('.modal-title').html('Изменить USER');

    let editButton = `<button type="button" id="editButton" class="btn btn-info">Изменить</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    user.then(user => {
        let dataRole = [{
            id: 1,
            name: 'ADMIN'
        }, {
                id: 2,
                name: 'USER'
            }]
        let bodyForm = `
             <form role="form" class="form-horizontal" id="editUser">
                        <div class="form-group">
                            <label for="id">ID
                                <input type="number" class="form-control" name="id" id="id" value="${user.id}"
                                       readonly="readonly">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Имя
                                <input type="text" class="form-control" id="name" value="${user.name}" 
                                       name="name">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Фамилия
                                <input type="text" class="form-control" id="lastName" value="${user.lastName}"
                                       name="lastName">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Возраст
                                <input type="number" class="form-control" id="age" value="${user.age}" name="age">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Электронная почта
                                <input type="text" class="form-control" id="email" value="${user.email}" name="email">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Пароль
                                <input type="password" class="form-control" id="password" value="${user.password}"
                                       name="password">
                            </label>
                        </div>
                        <div class="d-flex flex-row bd-highlight">
                            <div class="form-group">
                                <label for="roleList">Роль:
                                    <select id="roleList" class="custom-select bd-primary"
                                            size="2" name="roleList" multiple="multiple">
                                            <option value="${dataRole[0].id}" >${dataRole[0].name}</option>
                                            <option value="${dataRole[1].id}" >${dataRole[1].name}</option>
                                       
                                    </select>
                                </label>
                            </div>
                        </div>         
        `;
        modal.find('.modal-body').append(bodyForm);
        user.roles.forEach(role => {
            $('#roleList').val(role.id);

        })
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val();
        let name = modal.find('#name').val();
        let lastName = modal.find('#lastName').val();
        let email = modal.find('#email').val();
        let password = modal.find('#password').val();
        let age = modal.find('#age').val();
        let roles = modal.find('#roleList').val();
        let data = {
            id: id,
            name: name,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }
        console.log(data)
        await userService.updateUser(data, id);
            getUserTable();
            modal.modal('hide');
    })
}

async function deleteUser(modal, id) {
    let findUser = await userService.findOneUser(id);
    let user = findUser.json();

    modal.find('.modal-title').html('Удалить USER');

    let deleteButton = `<button type="button" id="deleteButton" class="btn btn-info">Удалить</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    user.then(user => {
        let dataRole = [{
            id: 1,
            name: 'ADMIN'
        }, {
            id: 2,
            name: 'USER'
        }]
        let bodyForm = `
             <form role="form" class="form-horizontal" id="editUser">
                        <div class="form-group">
                            <label for="id">ID
                                <input type="number" class="form-control" name="id" id="id" value="${user.id}"
                                       readonly="readonly">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Имя
                                <input type="text" class="form-control" id="name" value="${user.name}" 
                                       name="name" readonly="readonly">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Фамилия
                                <input type="text" class="form-control" id="lastName" value="${user.lastName}"
                                       name="lastName" readonly="readonly">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Возраст
                                <input type="number" class="form-control" id="age" value="${user.age}" name="age" readonly="readonly">
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Электронная почта
                                <input type="text" class="form-control" id="email" value="${user.email}" name="email" readonly="readonly">
                            </label>
                        </div>
                        <div class="d-flex flex-row bd-highlight">
                            <div class="form-group">
                                <label for="roleList">Роль:
                                    <select id="roleList" class="custom-select bd-primary"
                                            size="2" name="roleList" multiple="multiple" style="width: 210px" disabled="disabled">
                                            <option value="${dataRole[0].id}" >${dataRole[0].name}</option>
                                            <option value="${dataRole[1].id}" >${dataRole[1].name}</option>
                                       
                                    </select>
                                </label>
                            </div>
                        </div>         
        `;
        modal.find('.modal-body').append(bodyForm);
        user.roles.forEach(role => {
            $('#roleList').val(role.id);
        })
    })
    $("#deleteButton").on('click', async () => {
        await userService.deleteUser(id);
        getUserTable();
        modal.modal('hide');
    })
}

async function addNewUser() {
    $('#addNewUserButton').click(async () =>  {
        let addUserForm = $('#defaultSomeForm')
        let name = addUserForm.find('#name').val();
        let lastName = addUserForm.find('#lastName').val();
        let email = addUserForm.find('#email').val();
        let password = addUserForm.find('#password').val();
        let age = addUserForm.find('#age').val();
        let roles = addUserForm.find('#newRole').val();
        let data = {
            name: name,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }
        await userService.addNewUser(data);
            await getUserTable();
            addUserForm.find('#name').val('');
            addUserForm.find('#lastName').val('');
            addUserForm.find('#age').val('');
            addUserForm.find('#email').val('');
            addUserForm.find('#password').val('');
            addUserForm.find('#newRole').val('');
            document.getElementById('nav-home-tab').click()
    })
}
