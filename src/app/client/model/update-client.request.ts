/**
 * Update DTO.
 * Data required to modify an existing profile.
 */
export interface UpdateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}
