/*******************************************************************************
MIT License

Copyright (c) 2020 Natasha England-Elbro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
******************************************************************************/

/*/
----------------------------------------
Base64 - C++ file
Created on 19/01/2020 by Natasha England-Elbro,
-----------------------------------------
/*/

#ifndef LOCKETTE_BASE64_INL_CC86FA91CA464542919F0B82B87F98EA
#define LOCKETTE_BASE64_INL_CC86FA91CA464542919F0B82B87F98EA
/**
 * @file Header only file containing functions and classes for base64 encoding and decoding
 */


#include <cstddef>
#include <string>
#include <stdexcept>

namespace tgk::utils::b64 {

/// Unsigned char byte
using byte = unsigned char;

/// Defines the char type to use
/**
 * wchar_t - UNICODE support
 * char - ASCII only (also remove the L from the B64_LOOKUP_TBL if your doing this)
 */
using uchar = char;

/// Base64 alphabet for conversions
constexpr uchar B64_LOOKUP_TBL[] = {"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"};
/// Character used for padding '=' by default
constexpr uchar B64_PAD = '=';


/// Get the length of a message after being base64 encoded
/**
 * @tparam T: Any container with a size() method returning a valid size of the container
 * @param msg: A container of type T containing the message
 * @return The size of the message after being base64 encoded
 */
template <typename T>
size_t constexpr get_encoded_size(T msg) {
    return ((msg.size() / 3) + (msg.size() % 3 > 0) * 4);
}

/// Get the size of an encoded message when decoded
/**
 * @tparam T: Any container with a size() method returning a valid size of the container
 * @tparam C: Any implementable number basically
 * @param msg: A container of type T containing the message
 * @param padding: The amount of padding the message has, defaults to 0
 * @return The size required the hold the message once decoded
 */
template <typename T, typename C>
size_t constexpr get_decoded_size(T msg, C padding = 0) {
    return ((msg.size() / 4) * 3) - padding;
}

/// Check if something is valid base64
/**
 * Returns true if msg is valid base64 (dividable by 4 exactly)
 * @tparam T: Any container with a size() method returning a valid size
 * @param msg: A container matching T which contains the elements to check
 * @return True or False depending on if msg is valid base64 (with padding)
 */
template <typename T>
constexpr bool is_valid_b64(T msg) {
    return (msg.size() % 4) == 0;
}

/// Perform base64 encoding on an iterable container
/**
 *
 * @tparam T: Specifes a container which must implement size() to get its size and have an iterator object member. (i.e
 * std::vector)
 * @tparam C: The type of char to use, defaults to uchar which is wchar_t, supporting UNICODE
 * @tparam STR: A stream with the << operator
 * @tparam LK: The type of the lookup table. Must allow array access (using [ ] operator)
 * @param in: The container of type T which contains the elements to encode
 * @param out: The stream to push the output into
 * @param pad_char: The character to pad the output with, defaults to B64_PAD which is '='
 * @param lookup_tbl: The lookup table to use for conversion, default to B64_LOOKUP_TBL which is standard non-urlsafe
 * base64 encoding
 * @return The encoded string as basic_string<C> (which by default will be the same as wstring as C defaults to wchar_t)
 */

template <typename C = uchar, typename T, typename LK = C>
void b64_encode(T in, std::basic_ostream<C> &out, size_t in_size = -1, C pad_char = B64_PAD, LK lookup_tbl[] =
const_cast<LK *>
(B64_LOOKUP_TBL)) {

    if (in_size < 0) in_size = in.size();

    // Set the iterator (yes I called it c because I get to write c++)
    typename T::iterator c = in.begin();

    long oct = 0;

    for (size_t sec = 0; sec < in_size / 3; ++sec) {
        // Split the character into octs
        oct = (*c++) << 16;
        oct += (*c++) << 8;
        oct += (*c++);

        // Perform the shifts and append the shifted bits
        out << (1, lookup_tbl[(oct & 0x00fc0000) >> 18]);
        out << (1, lookup_tbl[(oct & 0x0003f000) >> 12]);
        out << (1, lookup_tbl[(oct & 0x00000fc0) >> 6]);
        out << (1, lookup_tbl[(oct & 0x0000003f)]);
    }

    // Pad the output
    // Check if remainder of dividing by 3
    auto remains = in.size() % 3;

    if (remains >= 1) {
        bool single_pad = remains == 2;
        oct = (*c++) << 16;
        if (single_pad) {
            // Single pad
            oct += (*c++) << 8;
        }

        // Shift
        out << (1, lookup_tbl[(oct & 0x00FC0000) >> 18]);
        out << (1, lookup_tbl[(oct & 0x0003F000) >> 12]);
        if (single_pad) {
            out << (1, lookup_tbl[(oct & 0x00000FC0) >> 6]);
        }
        // Add padding
        out << (single_pad ? 1 : 2, pad_char);
    }
}

/// Decode a base64 encoded string
/**
 * @tparam T: Any iterable container with a size() method returning a valid size
 * @tparam C: The char type to use, defaults to uchar (UNICODE)
 * @tparam STR: Any container with an append() method and initaliser
 * @param in: A container of type T containg the elements to decode
 * @param out: The stream to push to output too
 * @param pad_char: The char of type C used for padding on the encoded message. Defaults to '='
 * @return The decoded string as an std::basic_string<C>
 * @note Currently this is hardcoded for non-urlsafe decoding.
 */
template <typename C = uchar, typename T>
void b64_decode(T in, std::basic_ostream<C> &out, size_t in_size = -1, C pad_char = B64_PAD) {
    // Throw if [in] is invalid/not b64 encoded
    if (!is_valid_b64(in)) {
        throw std::invalid_argument("tgk::utils::b64::b64_decode received an invalid (not base64 "
                                    "encoded) message to decode!");
    }
    if (in_size < 0) in_size = in.size();

    auto padded = 0;
    if (in_size) {
        // Calculate padding
        if (*(in.end() - 1) == pad_char) padded++;
        if (*(in.end() - 2) == pad_char) padded++;
    }

    long oct = 0;

    for (auto c : in) {
        // Split each 4 char segment
        for (size_t sec = 0; sec < 4; ++sec) {
            oct <<= 4; // oct == 00010000 if oct = 1

            // [A-Z]
            if (c >= 0x41 && c <= 0x5A) {
                oct |= c - 0x41;
                // [a-z]
            } else if (c >= 0x61 && c <= 0x7A) {
                oct |= c - 0x47;
                // [0-9]
            } else if (c >= 0x30 && c <= 0x39) {
                oct |= c + 0x04;
                // '+'
            } else if (c == 0x2b) {
                oct |= 0x3e;
                // '/'
            } else if (c == 0x2f) { oct |= 0x3f; }
            else if (c == pad_char) {
                // Deal with padding
                switch (padded) {
                    case 1:
                        // Single padded
                        out << ((oct >> 16) & 0x000000ff);
                        out << ((oct >> 8) & 0x000000ff);
                        return;
                    case 2:
                        // Doubled passed
                        out << ((oct >> 10) & 0x000000ff);
                        return;
                    default:
                        throw std::invalid_argument("tgk::utils::b64::b64_decode received an invalid (not base64 "
                                                    "encoded) message to decode!");
                }
            }
        }
        out << ((oct >> 16) & 0x000000ff);
        out << ((oct >> 8) & 0x000000ff);
        out << (oct & 0x000000ff);
    }
}
}

#endif //LOCKETTE_BASE64_INL_CC86FA91CA464542919F0B82B87F98EA
