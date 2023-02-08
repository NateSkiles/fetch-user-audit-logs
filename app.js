require('dotenv').config()
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const baseUrl = 'https://api.kustomerapp.com'
const userId = '6142bf34def7f9001a1373f8'
const reqUrl = `/v1/audit-logs?filter[objectType]=work_session&filter[userId]=${userId}`
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

const fetchData = async () => {
    let data = [];
    try {
        const response = await fetch(baseUrl + reqUrl, reqOpts).then((res) => res.json());
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
    const data = await fetchData()
    const filteredData = data.filter((el) => el.attributes.userType === 'user')

    try {
        await csvWriter.writeRecords(filteredData)
        return console.log(`${filteredData.length} records written to CSV after filter`)
    } catch (e) {
        console.log(e)
    }
}

main()