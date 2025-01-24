function isValidTimestamp(timestamp: string) {
    const parsedTimestamp = Date.parse(timestamp);
    return !isNaN(parsedTimestamp);
}

describe("Reservations", () => {
    let jwt: string;

    beforeAll(async () => {
        const user = {
            email: "golangbank@gmail.com",
            password: "Test1234!"
        }

        await fetch("http://auth:3001/users",
            {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        const res = await fetch("http://auth:3001/auth/login",
            {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        jwt = await res.text()
        console.log(jwt);

    })

    const createReservation = async () => {
        return await fetch("http://reservations:3000/reservations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authentication: jwt
                },
                body: JSON.stringify(
                    {
                        "startDate": "11-11-2024",
                        "endDate": "11-05-2024",
                        "placeId": "12345",
                        "invoiceId": "123",
                        "charge": {
                            "amount": 5,
                            "card": {
                                "cvc": "413",
                                "exp_month": 12,
                                "exp_year": 2027,
                                "number": "4242 4242 4242 4242"
                            }
                        }
                    }
                )
            }
        )
    }

    test("Create and Get", async () => {
        expect(true).toBeTruthy()

        const resCreate = await createReservation()

        expect(resCreate.ok).toBeTruthy()
        const createdReservation = await resCreate.json()

        expect(isValidTimestamp(createdReservation?.timestamp)).toBe(true);
        expect(isValidTimestamp(createdReservation?.startDate)).toBe(true);
        expect(isValidTimestamp(createdReservation?.endDate)).toBe(true);
        expect(createdReservation?.userId).toBeDefined()
        expect(createdReservation?.invoiceId).toBeDefined()

        console.log(createdReservation)

        const responseGet = await fetch(
            `http://reservations:3000/reservations/${createdReservation._id}`,
            {
                method: "GET",
                headers: {
                    Authentication: jwt
                },
            }
        );
        const reservation = await responseGet.json()

        expect(createdReservation).toEqual(reservation)
    })
})