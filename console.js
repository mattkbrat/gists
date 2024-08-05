// paste all of this in your browser developer console

deleteAllRecords();

async function deleteAllRecords() {
    let e;
    filterEditButtons().forEach((e) => e.click());
    while (e = filterDeleteButtons()[0]) {
        e.click();
        await confirmDelete();
    }
}
function filterDeleteButtons() {
    return [
        ...[...document.querySelectorAll('a')].filter((e) => e.innerHTML === '<span>Delete</span>'),
        ...[...document.querySelectorAll('button')].filter((e) => e.innerHTML === 'Delete'),
    ];
}
function filterEditButtons() {
    return [
        ...document.querySelectorAll('a'),//old layout
        ...document.querySelectorAll('button')
    ].filter((e) => e.innerHTML.indexOf('<span>Edit</span>') != -1 );
}
function confirmDelete(iteration) {
    iteration = iteration || 1;
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            let button = [...document.querySelectorAll('button')].filter((e) => e.innerHTML === '<span>Delete</span>')[0];
            if (button) {
                button.click();
                await waitConfirmDelete();
                resolve();
            } else if (iteration > 30) {
                console.log('failed confirmDelete');
                reject();
            } else {
                confirmDelete(iteration + 1)
            }
        }, 100);
    });
}
function waitConfirmDelete() {
    return new Promise((resolve, reject) => {
        let iteration = 1;
        let i = setInterval(() => {
            if (iteration++ > 30) {
                clearInterval(i);
                reject();
                return;
            }
            if ([...document.querySelectorAll('button')].filter((e) => e.innerHTML === '<span>Delete</span>')[0]) {
                return;
            }
            clearInterval(i);
            resolve();
        }, 100)
    });
}