export const fileDrivetoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk2Mywic3ViIjoxOTYzLCJpYXQiOjE3Mzc1NDYyMTIsImV4cCI6MTgyMzk0NjIxMn0.rX-jNHi62-mwcgUXUqSqndqM1HzueC3Oz0DxYVs7214"
const baseUrl = "https://api.mitedrive.com/api"

export const getUploadServer = async () => {
    const request = await fetch(`${baseUrl}/upload`, {
        headers: {
            Authorization: `Bearer ${fileDrivetoken}`
        },
    })

    const response = await request.json();
    return response.data;
}