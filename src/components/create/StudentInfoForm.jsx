import Input from '../Input'
import Select from '../Select'
import Tooltip from '../Tooltip'

export default function StudentInfoForm({ formData, onChange }) {
    return (
        <div>
            <Tooltip content="유아의 기본 정보를 입력해주세요" position="top">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    👶 유아 정보
                </label>
            </Tooltip>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    value={formData.studentName}
                    onChange={(e) => onChange({ ...formData, studentName: e.target.value })}
                    placeholder="이름"
                    helperText="유아의 이름을 입력하세요"
                />
                <Select
                    value={formData.age}
                    onChange={(e) => onChange({ ...formData, age: e.target.value })}
                >
                    <option value="">연령 선택</option>
                    <option value="만 3세">만 3세</option>
                    <option value="만 4세">만 4세</option>
                    <option value="만 5세">만 5세</option>
                </Select>
            </div>
        </div>
    )
}
