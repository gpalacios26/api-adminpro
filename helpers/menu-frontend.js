const getMenuFrontEnd = (role = 'USER_ROLE') => {

    const menu = [
        {
            titulo: 'Dahboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Main', url: '/dashboard' },
                { titulo: 'Progress Bar', url: '/dashboard/progress' },
                { titulo: 'Gráficas', url: '/dashboard/grafica1' },
                { titulo: 'Promesas', url: '/dashboard/promesas' },
                { titulo: 'Rxjs', url: '/dashboard/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { titulo: 'Hospitales', url: '/dashboard/hospitales' },
                { titulo: 'Médicos', url: '/dashboard/medicos' }
            ]
        }
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/dashboard/usuarios' });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}