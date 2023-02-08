const readlineSync = require('readline-sync')
require('dotenv').config()
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const reqOpts = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
    }
}

const csvWriter = createCsvWriter({
    path: `./output/${new Date().toISOString()}.csv`,
    header: ['id', 'attributes.userType', 'attributes.objectType', 'attributes.client', 'attributes.changes.relationships.status.before', 'attributes.changes.relationships.status.after', 'attributes.createdAt', 'attributes.publishedAt'].map((item) => ({ id: item, title: item })),
    headerIdDelimiter: '.'
})

const fetchData = async (id) => {
    const baseUrl = 'https://api.kustomerapp.com'
    const endPointUrl = `/v1/audit-logs`
    const queryStr = `?filter[objectType]=work_session&filter[userId]=${id}`
    const reqUrl = baseUrl + endPointUrl + queryStr
    let data = [];
    try {
        const response = await fetch(reqUrl, reqOpts).then((res) => res.json());
        data = data.concat(response.data)
        console.log(`Initial: ${data.length} Records`);
        const cursorCount = response.meta.cursorCount
        let nextUrl = response.links.next

        for (let i = 1; i < cursorCount; i++) {
            const nextQuery = await fetch(baseUrl + nextUrl, reqOpts).then((res) => res.json());
            nextUrl = nextQuery.links.next
            data = data.concat(nextQuery.data)
            console.log(`Query ${i + 1}: ${data.length} Records`);
            await new Promise(resolve => setTimeout(resolve, 2500))
        }
    } catch (e) {
        console.log(e);
    }
    return data
}

const main = async () => {
    const userId = readlineSync.question('Please enter a User ID: ')

    const data = await fetchData(userId)
    const filteredData = data.filter((el) => {
        if (el.attributes.changes?.relationships?.status?.before && el.attributes.userType === 'user') { return true }
    })

    try {
        await csvWriter.writeRecords(filteredData)
        return console.log(`${filteredData.length} records written to CSV after filter`)
    } catch (e) {
        console.log(e)
    }
}

main()