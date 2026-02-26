import jwt from "jsonwebtoken"

// Fetch user information from user service
export const getUserInfo = async (event: any) => {
  try {
    const token = event.cookies?.authToken

    const user = jwt.decode(token)
    return user
  } catch (error) {
    console.error("Error fetching user info:", error)
    return null
  }
}

// Format date for email
export const formatDate = (date?: Date): string => {
  if (!date) return "No due date"
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
